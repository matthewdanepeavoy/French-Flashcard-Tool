<?php

namespace App\Http\Controllers;

use App\Models\Word;
use Inertia\Inertia;
use App\Models\Phrase;
use Illuminate\Http\Request;

class WordFormController extends Controller
{
    public function show() {

        return Inertia::render('PhraseAddEdit', [
            // 'questions' => $questions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'french' => 'required|string|max:255',
            'english' => 'required|string|max:255',
        ]);

        $phrase = Phrase::create([
            'french' => $validated['french'],
            'english' => $validated['english'],
        ]);
        // dd($phrase);

        // Return Inertia response with the new phrase data
        // return back();

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

        $existingWords = Word::whereIn('word', $words)
            ->pluck('word')
            ->toArray();

        // Return associative array word => true if exists
        $response = [];
        foreach ($words as $w) {
            $response[$w] = in_array($w, $existingWords);
        }

        return Inertia::render('PhraseAddEdit', [
            'existingWords' => $response
        ]);
    }

     // Store new words and link to phrase
    public function storeWords(Request $request)
    {
        $validated = $request->validate([
            'phrase_id' => 'required|exists:phrases,id',
            'words' => 'required|array',
            'words.*.word' => 'required|string|max:100',
            'words.*.type' => 'required|string|in:Verb,Noun,Adjective,Adverb',
            'words.*.hints' => 'nullable|string|max:500',
            'words.*.infinitive' => 'nullable|string|max:100',
            'words.*.conjugations' => 'nullable|array',
            'words.*.conjugations.*' => 'string|max:100',
        ]);

        $phrase = Phrase::findOrFail($validated['phrase_id']);

        foreach ($validated['words'] as $wordData) {
            // Create or update the word
            $word = Word::updateOrCreate(

                // IF INFINITIVE EXISTS, MAKE THIS THE BASE WORD.
                // TYPE CAN BE FIXED EXPRESSION
                // VARIATIONS?

                ['word' => $wordData['word']],
                [
                    'type' => $wordData['type'],
                    'hints' => $wordData['hints'] ?? null,
                    // 'infinitive' => $wordData['infinitive'] ?? null,
                    'conjugations' => isset($wordData['conjugations']) ? json_encode($wordData['conjugations']) : null,
                ]
            );

            // Attach word to phrase if not attached
            if (!$phrase->words()->where('word_id', $word->id)->exists()) {
                $phrase->words()->attach($word->id);
            }
        }

        return response()->json(['message' => 'Words saved and linked successfully.']);
    }
}
