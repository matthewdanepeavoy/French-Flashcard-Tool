<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Phrase;
use Illuminate\Http\Request;

class FlashcardController extends Controller
{
    public function index(Request $request)
    {
        return $this->renderFlashcards($request);
    }

    public function checkAnswer(Request $request)
    {
        $phrase = Phrase::find($request->question['id']);

        $phrase->increment('correct_count');

        if ($request->input('attempts')) {
            $phrase->increment('error_count');
        }

        // Get a new random question
        return $this->renderFlashcards($request);
    }

    private function renderFlashcards($request) {
        $practice_type = false;
        if ($request->input('type')) {
            $practice_type = $request->input('type');
        }

        $questions = Phrase::with('words')
            ->orderBy('updated_at', 'asc') // oldest updated first
            ->when(fn() => $practice_type, function($query) use ($practice_type) {
                if ($practice_type == 'phrases') {
                    return $query->where('to_practice', true);
                }

                return $query->whereHas('words', function($q2) {
                    return $q2->where('to_practice', true);
                });
            })
            ->limit(1)
            ->get();

        return Inertia::render('Flashcards', [
            'loadedQuestions' => $questions,
            'practice_mode' => $practice_type
        ]);
    }
}
