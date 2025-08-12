<?php

namespace App\Models;

use App\Models\Phrase;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Word extends Model
{
    protected $guarded = [];

    protected $casts = [
        'conjugations' => 'array'
    ];

    public function phrases(): BelongsToMany {
        return $this->belongsToMany(Phrase::class);
    }
}
