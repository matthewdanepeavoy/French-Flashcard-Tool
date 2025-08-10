<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FlashcardController extends Controller
{
    public function index()
    {
        $questions = [
            ['id' => 1, 'english' => 'I am going to the market', 'french' => 'Je vais au marché'],
            ['id' => 2, 'english' => 'She is reading a book', 'french' => 'Elle lit un livre'],
            ['id' => 3, 'english' => 'We are eating at the restaurant', 'french' => 'Nous mangeons au restaurant'],
            ['id' => 4, 'english' => 'They are playing football', 'french' => 'Ils jouent au football'],
            ['id' => 5, 'english' => 'Do you like coffee', 'french' => 'Aimes-tu le café'],
        ];

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
