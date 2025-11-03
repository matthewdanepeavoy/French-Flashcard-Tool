<?php

namespace App\Http\Controllers;

use App\Enums\Level;
use App\Models\Word;
use Inertia\Inertia;
use App\Models\Phrase;
use App\Enums\Language;
use App\Enums\WordType;
use Illuminate\Http\Request;

class WordFormController extends Controller
{
    public function show() {

        return Inertia::render('PhraseAddEdit', [
            'existingWords' => session('existingWords', []),
        ]);
    }

    public function store(Request $request)
    {

        // @todo: This needs to store a phrase if it doesn't already exist.

        $validated = $request->validate([
            'phrase' => 'required|string|max:255',
            'english' => 'required|string|max:255',
        ]);

        $phrase = Phrase::create([
            'language' => Language::French->value,
            'level' => Level::A1->value,
            'phrase' => $validated['phrase'],
            'english' => $validated['english'],
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

        $matches = [];

        // @todo: Check existence of verbs. The tenses may be different.
        // If not matching originally, check with conjugations, ex. je suis, j'aime, tu aimes


        // Check existence of verbs with different j' je forms

        // NOUNS
            // masculine forms & feminime forms of nouns ()


            // Have word "forms", just like "conjugations"
            // First search base word. If no results:
            // if "s" at end, try stripping the s and searching for "string contains"
            // if e at end, try removing teh e and searching for "string contains"


        foreach($words as $word) {
            $match = Word::query()
                ->where(function ($query) use ($word) {
                    $query->where('word', $word)
                        ->orWhereRaw("CONCAT(word, 's') = ?", [$word])
                        ->orWhere('feminine_form', $word)
                        ->orWhereRaw("CONCAT(feminine_form, 's') = ?", [$word])
                        ->orWhere('contracted_form', $word)
                        ->orWhere(function ($q) use ($word) {
                            $q->where('type', WordType::Verb->value)
                            ->where(function ($jsonQ) use ($word) {
                                // check all conjugations
                                $jsonQ->orWhereJsonContains('conjugations', $word)
                                        ->orWhereJsonContains('conjugations', $word.'s'); // optional plural for conjugation
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


        // dd($request->words);
        // @todo: IMPT: EVEN IF WORD ALREADY EXISTS, WE WANT TO ASSOCIATE THIS PHRASE TO IT.

        // If all matches, no words are being passed along!!!!!!
        // This == []

        // @todo: We need an array of found words, and all we need is the word IDs to associate.


        // @todo: IF VERB
        // Need to track infinitive and all conjugations
        // Query based on all conjugations, and intelligently determine if I used the verb wrong.
        // @todo: Remember the INFINITIVE is just 'word' in our Word model. We want that as the base word.



        // now existing words will have an ID.



        foreach ($request->words as $data) {

            if (! $data['exists']) {
                $word = $data['word'];
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
