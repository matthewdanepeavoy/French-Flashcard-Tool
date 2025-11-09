<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Phrase;
use Illuminate\Http\Request;

class FlashcardController extends Controller
{
    public function index()
    {
        $questions = Phrase::with('words')->inRandomOrder()->limit(50)->get();

        return Inertia::render('Flashcards', [
            'questions' => $questions
        ]);
    }

    public function checkAnswer(Request $request)
    {
        $phrase = Phrase::find($request->question['id']);

        $phrase->increment('correct_count');

        if ($request->input('attempts')) {
            $phrase->increment('error_count');
        }
    }
}
