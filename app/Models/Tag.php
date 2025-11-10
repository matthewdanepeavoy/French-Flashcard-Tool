<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'name'
    ];

    public function phrases(): BelongsToMany
    {
        return $this->belongsToMany(Phrase::class, 'phrases_tags');
    }

    public function words(): BelongsToMany
    {
        return $this->belongsToMany(Word::class, 'tags_words');
    }
}
