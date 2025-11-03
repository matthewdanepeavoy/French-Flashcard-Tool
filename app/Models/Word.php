<?php

namespace App\Models;

use App\Enums\Level;
use App\Models\Phrase;
use App\Enums\Language;
use App\Enums\WordType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Word extends Model
{
    protected $guarded = [];

    protected $casts = [
        'conjugations' => 'array',
        'type' => WordType::class,
        'language' => Language::class,
    ];

    public function phrases(): BelongsToMany {
        return $this->belongsToMany(Phrase::class);
    }
}
