<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\WordController;
use App\Http\Controllers\WordFormController;

Route::get('/home', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/words/index', [WordController::class, 'index'])->name('words.index');

    Route::get('/', [FlashcardController::class, 'index'])->name('flashcards.index');
    Route::post('/check-answer', [FlashcardController::class, 'checkAnswer'])->name('flashcards.check');

    Route::get('/phrases', [WordFormController::class, 'show'])->name('wordform.show');
    Route::post('/phrases', [WordFormController::class, 'store'])->name('wordform.store');
    Route::post('/words/check-existence', [WordFormController::class, 'checkExistence'])->name('wordform.check-existence');
    Route::post('/words', [WordFormController::class, 'storeWords'])->name('wordform.words.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
