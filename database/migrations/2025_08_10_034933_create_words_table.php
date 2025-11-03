<?php

use App\Enums\Level;
use App\Enums\Language;
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
        Schema::create('words', function (Blueprint $table) {
            $table->id();
            $table->string('word');
            $table->string('feminine_form')->nullable();
            $table->string('type')->nullable(); // verb, noun, etc.
            $table->string('definition')->nullable();
            $table->string('hints')->nullable();
            $table->string('contracted_form')->nullable();
            $table->integer('verb_group')->nullable();
            $table->json('conjugations')->nullable();
            $table->string('language')->default(Language::French->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('words');
    }
};
