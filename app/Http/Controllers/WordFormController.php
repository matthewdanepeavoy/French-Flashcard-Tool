<?php

namespace App\Http\Controllers;

use App\Enums\Level;
use App\Models\Word;
use Inertia\Inertia;
use App\Models\Phrase;
use App\Enums\Language;
use App\Enums\WordType;
use App\Enums\PhraseType;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class WordFormController extends Controller
{
    public function show() {
        return Inertia::render('PhraseAddEdit', [
            'types' => PhraseType::cases(),
            'existingWords' => session('existingWords', []),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'phrase' => 'required|string|max:255',
            'english' => 'required|string|max:255',
            'type' => 'required'
        ]);

        $phrase = Phrase::create([
            'language' => Language::French->value,
            'level' => Level::A1->value,
            'phrase' => $validated['phrase'],
            'english' => $validated['english'],
            'type' => $validated['type']
        ]);

        return Inertia::render('PhraseAddEdit', [
            'phrase' => $phrase,
            'someData' => [],
        ]);
    }

     // API to check which words exist, expects array of words
    public function checkExistence(Request $request)
    {
        $request->validate([
            'words' => 'required|array',
            'words.*' => 'string|max:100',
        ]);

        $words = $request->input('words');

        // remove punctuation
        $filtered_words = [];
        foreach($words as $word) {
            $filtered_words[] = preg_replace('/[.,!?;:]/', '', $word);
        }

        $matches = [];

        foreach($filtered_words as $word) {
            $match = Word::query()
                ->where(function ($query) use ($word) {
                    $query
                        ->whereRaw('LOWER(word) = ?', [$word])
                        ->orWhereRaw("LOWER(CONCAT(word, 's')) = LOWER(?)", [$word])
                        ->orWhereRaw("LOWER(CONCAT(word, 'x')) = LOWER(?)", [$word]) // ex cadeau / cadeaux
                        ->orWhere('feminine_form', $word)
                        ->orWhereRaw("LOWER(CONCAT(feminine_form, 's')) = LOWER(?)", [$word])
                        ->orWhere('contracted_form', $word)
                        ->orWhere(function ($q) use ($word) {
                            $q
                                ->where('type', WordType::Verb->value)
                                ->where(function ($jsonQ) use ($word) {
                                    // check all conjugations
                                    $jsonQ->orWhereJsonContains('conjugations', $word)
                                        ->orWhereJsonContains('conjugations', $word . 's'); // optional plural for conjugation

                                    // ex parlé = spoken
                                    // look for parler (to speak)
                                    $infinitive = null;
                                    if (Str::endsWith($word, 'é')) {
                                        $infinitive = Str::replaceLast('é', 'er', $word);
                                    }

                                    if (Str::endsWith($word, 'ée')) {
                                        $infinitive = Str::replaceLast('ée', 'er', $word);
                                    }

                                    // ALSO match infinitive in `word` column
                                    if ($infinitive) {
                                        $jsonQ
                                            ->orWhereRaw("LOWER(word) = LOWER(?)", [$infinitive]);
                                    }
                                });
                        });
                })
                ->first();

            $matches[$word] = $match;
        }

        return redirect()->back()->with('existingWords', $matches);
    }

     // Store new words and link to phrase
    public function storeWords(Request $request)
    {

        $phrase = Phrase::findOrFail($request->phrase_id);

        foreach ($request->words as $data) {

            if (! $data['exists']) {
                $word = $data['masculine_form'];
                $conjugations = null;
                if ( $data['type'] == WordType::Verb->value ) {
                    $word = $data['conjugations'][0];
                    $conjugations = [
                        $data['conjugations'][1],
                        $data['conjugations'][2],
                        $data['conjugations'][3],
                        $data['conjugations'][4],
                        $data['conjugations'][5],
                        $data['conjugations'][6],
                    ];
                }

                // Create or update the word
                $model = Word::create([
                        'word' => $word,
                        'type' => $data['type'],
                        'hints' => $data['hints'] ?? null,
                        'definition' => $data['definition'] ?? null,
                        'feminine_form' => $data['feminine_form'] ?? null,
                        'contracted_form' => $data['contracted_form'] ?? null,
                        'conjugations' => $conjugations,
                        'verb_group' => $data['verb_group'] ?? null
                    ]);
            } else {
                $model = Word::find($data['id']);
            }

            // Attach word to phrase if not attached
            if (!$phrase->words()->where('word_id', $model->id)->exists()) {
                $phrase->words()->attach($model->id);
            }
        }

        return redirect()->route('wordform.show');
    }
}
