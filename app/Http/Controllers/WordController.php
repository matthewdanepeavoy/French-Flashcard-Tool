<?php

namespace App\Http\Controllers;

use App\Models\Word;
use Inertia\Inertia;
use App\Models\Phrase;
use Illuminate\Http\Request;

class WordController extends Controller
{
    public function index(Request $request) {
        $words = Word::
        with([
            'phrases:id,phrase,english',
            'tags:id,name', // assuming your tags table has 'id' and 'name'
        ])
        ->get();

        // Group by tags
        $grouped = collect();

        // 1️⃣ Words without tags -> group by type
        $untagged = $words->filter(fn($word) => $word->tags->isEmpty())
            ->sortBy('word')
            ->groupBy('type');
        $grouped['Untagged'] = $untagged;

        // 2️⃣ Words with tags -> group by each tag name
        $words->filter(fn($word) => $word->tags->isNotEmpty())
            ->each(function ($word) use ($grouped) {
                foreach ($word->tags as $tag) {
                    $grouped[$tag->name] ??= collect();
                    $grouped[$tag->name]->push($word);
                }
            });

        // Sort groups alphabetically except "Untagged" stays first
        $sorted = collect(['Untagged' => $grouped['Untagged'] ?? collect()])
            ->merge($grouped->except('Untagged')->sortKeys());

        return Inertia::render('WordsIndex', [
            'words' => $sorted,
        ]);

    }

    public function showPhrases(Request $request)
    {
        $phrases = Phrase::
            with([
                'words:id,word',
                'tags:id,name', // assuming your tags table has 'id' and 'name'
            ])
            ->get();

        // Group by tags
        $grouped = collect();

        // 1️⃣ Words without tags -> group by type
        $untagged = $phrases->filter(fn($phrase) => $phrase->tags->isEmpty())
            ->sortBy('word')
            ->groupBy('type');
        $grouped['Untagged'] = $untagged;

        // 2️⃣ Words with tags -> group by each tag name
        $phrases->filter(fn($phrase) => $phrase->tags->isNotEmpty())
            ->each(function ($phrase) use ($grouped) {
                foreach ($phrase->tags as $tag) {
                    $grouped[$tag->name] ??= collect();
                    $grouped[$tag->name]->push($phrase);
                }
            });

        // Sort groups alphabetically except "Untagged" stays first
        $sorted = collect(['Untagged' => $grouped['Untagged'] ?? collect()])
            ->merge($grouped->except('Untagged')->sortKeys());

        return Inertia::render('PhrasesIndex', [
            'phrases' => $sorted,
        ]);

    }
}
