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
            'existingWords' => session('existingWords', []),
        ]);
    }

    public function store(Request $request)
    {

        // @todo: This needs to store a phrase if it doesn't already exist.
        // @todo: This needs to store the level of the phrase. Ex. A1.


        $validated = $request->validate([
            'french' => 'required|string|max:255',
            'english' => 'required|string|max:255',
        ]);

        $phrase = Phrase::create([
            'french' => $validated['french'],
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



        // @todo: Check existence of verbs. The tenses may be different.
        // If not matching originally, check with conjugations, ex. je suis, j'aime, tu aimes


        $existingWords = Word::whereIn('word', $words)
            ->pluck('word')
            ->toArray();

        // Return associative array word => true if exists
        $response = [];
        foreach ($words as $w) {
            $response[$w] = in_array($w, $existingWords);
        }

        return redirect()->back()->with('existingWords', $response);
    }

     // Store new words and link to phrase
    public function storeWords(Request $request)
    {
        // $validated = $request->validate([
            // 'phrase_id' => 'required|exists:phrases,id',
            // 'words' => 'required|array',
            // 'words.*.word' => 'required|string|max:100',
            // 'words.*.type' => 'required|string|in:Verb,Noun,Adjective,Adverb',
            // 'words.*.hints' => 'nullable|string|max:500',
            // 'words.*.infinitive' => 'nullable|string|max:100',
            // 'words.*.conjugations' => 'nullable|array',
            // 'words.*.conjugations.*' => 'string|max:100',
        // ]);

        // @todo: IMPT: EVEN IF WORD ALREADY EXISTS, WE WANT TO ASSOCIATE THIS PHRASE TO IT.

        // @todo: IF VERB
            // Need to track infinitive and all conjugations
            // Query based on all conjugations, and intelligently determine if I used the verb wrong.

        $phrase = Phrase::findOrFail($request->phrase_id);

        foreach ($request->words as $wordData) {
            // Create or update the word
            $word = Word::updateOrCreate(

                ['word' => $wordData['word']],
                [
                    'type' => $wordData['type'],
                    'hints' => $wordData['hints'] ?? null,

                    // @todo:
                    // 'infinitive' => $wordData['infinitive'] ?? null,
                    // infinitive and conjugations together now?
                    // if verb, verb 'group' needs to be here.

                    'conjugations' => isset($wordData['conjugations']) ? $wordData['conjugations'] : null,
                ]
            );

            // Attach word to phrase if not attached
            if (!$phrase->words()->where('word_id', $word->id)->exists()) {
                $phrase->words()->attach($word->id);
            }
        }

        dd($phrase->with('words')->get());

        dd($request->all());

        // return response()->json(['message' => 'Words saved and linked successfully.']);
    }
}
