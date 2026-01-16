<?php

use App\Models\Tag;
use App\Models\Word;
use Inertia\Inertia;
use App\Models\Story;
use App\Models\Phrase;
use App\Enums\WordType;
use App\Models\Sentence;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WordController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\WordFormController;
use App\Http\Controllers\FlashcardController;


Route::get('/test', function() {
    // $word = 'passé';
    // $match = Word::query()
    //     ->where(function ($query) use ($word) {
    //         $query
    //             // ->whereRaw('LOWER(word) = ?', [$word])
    //             // ->orWhereRaw("LOWER(CONCAT(word, 's')) = LOWER(?)", [$word])
    //             // ->orWhereRaw("LOWER(CONCAT(word, 'x')) = LOWER(?)", [$word]) // ex cadeau / cadeaux
    //             // ->orWhere('feminine_form', $word)
    //             // ->orWhereRaw("LOWER(CONCAT(feminine_form, 's')) = LOWER(?)", [$word])
    //             // ->orWhere('contracted_form', $word)
    //             ->orWhere(function ($q) use ($word) {
    //                 $q
    //                     ->where('type', WordType::Verb->value)
    //                     ->where(function ($jsonQ) use ($word) {
    //                         // check all conjugations
    //                         $jsonQ->orWhereJsonContains('conjugations', $word)
    //                             ->orWhereJsonContains('conjugations', $word . 's'); // optional plural for conjugation

    //                         // ex parlé = spoken
    //                         // look for parler (to speak)
    //                         $infinitive = null;
    //                         if (Str::endsWith($word, 'é')) {
    //                             $infinitive = Str::replaceLast('é', 'er', $word);
    //                         }

    //                         // ALSO match infinitive in `word` column
    //                         if ($infinitive) {
    //                             $jsonQ->orWhereRaw("LOWER(word) = LOWER(?)", [$infinitive]);
    //                         }
    //                     });
    //             });
    //     })
    //     ->first();

    // dd($match);

    // $matches[$word] = $match;
});


Route::get('/home', function () {
    return Inertia::render('welcome');
})->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/words/index', [WordController::class, 'index'])->name('words.index');
    Route::get('/phrases/index', [WordController::class, 'showPhrases'])->name('phrases.index');
    Route::post('/practice/toggle', [WordController::class, 'togglePractice'])->name('toggle.practice');

    Route::get('/', [FlashcardController::class, 'index'])->name('flashcards.index');
    Route::get('/check-answer', function(Request $request) {
        return redirect()->route('flashcards.index');
    })->name('flashcards.check');

    Route::post('/check-answer', [FlashcardController::class, 'checkAnswer'])->name('flashcards.check');

    Route::get('/phrases', [WordFormController::class, 'show'])->name('wordform.show');
    Route::post('/phrases', [WordFormController::class, 'store'])->name('wordform.store');
    Route::post('/words/check-existence', [WordFormController::class, 'checkExistence'])->name('wordform.check-existence');
    Route::post('/words', [WordFormController::class, 'storeWords'])->name('wordform.words.store');


    Route::get('/stories/add', [StoryController::class, 'add'])->name('story.add');
    Route::post('/stories/post', [StoryController::class, 'post'])->name('story.post');

// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
