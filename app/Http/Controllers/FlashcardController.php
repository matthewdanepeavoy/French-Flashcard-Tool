<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Phrase;
use Illuminate\Http\Request;

class FlashcardController extends Controller
{
    public function index()
    {
        $questions = Phrase::limit(50)->get();

        return Inertia::render('Flashcards', [
            'questions' => $questions
        ]);
    }

    public function checkAnswer(Request $request)
    {
        $correctPhrase = $request->input('correct');
        $userAnswer = trim($request->input('answer'));

        $correctWords = preg_split('/\s+/', strtolower($correctPhrase));
        $userWords = preg_split('/\s+/', strtolower($userAnswer));

        $wordResults = [];
        $correctCount = 0;

        foreach ($correctWords as $i => $word) {
            if (isset($userWords[$i]) && $userWords[$i] === $word) {
                $wordResults[] = ['word' => $userWords[$i], 'correct' => true];
                $correctCount++;
            } else {
                $wordResults[] = ['word' => $userWords[$i] ?? '', 'correct' => false, 'expected' => $word];
            }
        }

        $accuracy = round(($correctCount / count($correctWords)) * 100, 2);
        $isExact = strtolower($userAnswer) === strtolower($correctPhrase);

        return response()->json([
            'isExact' => $isExact,
            'accuracy' => $accuracy,
            'wordResults' => $wordResults
        ]);
    }
}
