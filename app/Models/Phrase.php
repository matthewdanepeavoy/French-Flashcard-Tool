<?php

namespace App\Models;

use App\Enums\Level;
use App\Models\Word;
use App\Enums\Language;
use App\Enums\PhraseType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Phrase extends Model
{
    protected $guarded = [];

    protected $casts = [
        'language' => Language::class,
        'level' => Level::class,
        'type' => PhraseType::class,
    ];

    public function words(): BelongsToMany {
        return $this->belongsToMany(Word::class);
    }
}
