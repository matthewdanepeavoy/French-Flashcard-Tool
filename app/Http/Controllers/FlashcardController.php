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
            ['id' => 101, 'english' => 'I am happy', 'french' => 'Je suis heureux'],
            ['id' => 102, 'english' => 'She is reading a book', 'french' => 'Elle lit un livre'],
            ['id' => 103, 'english' => 'We go to the beach', 'french' => 'Nous allons à la plage'],
            ['id' => 104, 'english' => 'They have two cats', 'french' => 'Ils ont deux chats'],
            ['id' => 105, 'english' => 'Do you speak French?', 'french' => 'Parles-tu français ?'],
            ['id' => 106, 'english' => 'I want some coffee', 'french' => 'Je veux du café'],
            ['id' => 107, 'english' => 'He works in Paris', 'french' => 'Il travaille à Paris'],
            ['id' => 108, 'english' => 'The sky is blue', 'french' => 'Le ciel est bleu'],
            ['id' => 109, 'english' => 'We love music', 'french' => 'Nous aimons la musique'],
            ['id' => 110, 'english' => 'Where is the train station?', 'french' => 'Où est la gare ?'],
            ['id' => 111, 'english' => 'I need a doctor', 'french' => 'J\'ai besoin d\'un médecin'],
            ['id' => 112, 'english' => 'She has a new car', 'french' => 'Elle a une nouvelle voiture'],
            ['id' => 113, 'english' => 'Open the window', 'french' => 'Ouvre la fenêtre'],
            ['id' => 114, 'english' => 'They are eating dinner', 'french' => 'Ils dînent'],
            ['id' => 115, 'english' => 'He is very tall', 'french' => 'Il est très grand'],
            ['id' => 116, 'english' => 'The children are playing', 'french' => 'Les enfants jouent'],
            ['id' => 117, 'english' => 'I am learning French', 'french' => 'J\'apprends le français'],
            ['id' => 118, 'english' => 'Turn left at the corner', 'french' => 'Tournez à gauche au coin'],
            ['id' => 119, 'english' => 'The book is on the table', 'french' => 'Le livre est sur la table'],
            ['id' => 120, 'english' => 'Can you help me?', 'french' => 'Peux-tu m\'aider ?'],
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
