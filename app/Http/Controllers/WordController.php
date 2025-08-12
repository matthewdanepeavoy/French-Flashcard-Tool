<?php

namespace App\Http\Controllers;

use App\Models\Word;
use Inertia\Inertia;
use Illuminate\Http\Request;

class WordController extends Controller
{
    public function index(Request $request) {
        $words = Word::with([
            'phrases:id,french,english',
            // 'conjugations' // if you have a conjugations relation
        ])
        ->get()
        ->sortBy('word')
        ->groupBy('type');

        return Inertia::render('WordsIndex', [
            'words' => $words
        ]);
    }
}
