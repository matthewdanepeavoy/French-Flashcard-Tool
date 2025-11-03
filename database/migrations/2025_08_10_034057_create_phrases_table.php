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
        Schema::create('phrases', function (Blueprint $table) {
            $table->id();
            $table->string('language')->default(Language::French->value);
            $table->string('level')->default(Level::A1->value);
            $table->string('phrase');
            $table->string('english');
            $table->integer('correct_count')->default(0);
            $table->integer('error_count')->default(0);
            $table->boolean('mastered')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phrases');
    }
};
