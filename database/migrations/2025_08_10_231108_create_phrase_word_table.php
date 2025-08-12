<?php

use App\Models\Word;
use App\Models\Phrase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('phrase_word', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Phrase::class);
            $table->foreignIdFor(Word::class);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phrase_word');
    }
};
