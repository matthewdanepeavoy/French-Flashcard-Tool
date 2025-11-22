<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Story extends Model
{
    protected $guarded = [];

    public function sentences() : HasMany
    {
        return $this->hasMany(Sentence::class)->orderBy('order');
    }

    public function words(): BelongsToMany
    {
        return $this->belongsToMany(Word::class);
    }
}
