<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Phrase;
use Illuminate\Http\Request;

class FlashcardController extends Controller
{
    public function index()
    {
        $questions = Phrase::with('words')
            ->orderBy('updated_at', 'asc') // oldest updated first

            // ->inRandomOrder()
            ->limit(1)->get();

        return Inertia::render('Flashcards', [
            'loadedQuestions' => $questions,
            'default' => 'default'
        ]);
    }

    public function checkAnswer(Request $request)
    {
        $phrase = Phrase::find($request->question['id']);

        $phrase->increment('correct_count');

        if ($request->input('attempts')) {
            $phrase->increment('error_count');
        }

        // Get a new random question
        $newQuestion = Phrase::with('words')
            ->orderBy('updated_at', 'asc') // oldest updated first

            // ->inRandomOrder()
            ->first();
        info($newQuestion->id);

        // Return it as JSON for Inertia
        return Inertia::render('Flashcards', [
            'newQuestion' => [$newQuestion], // send as array if your frontend expects it
            // optionally send other props like score, attempts, etc.
        ]);
    }
}
