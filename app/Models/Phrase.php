<?php

namespace App\Models;

use App\Models\Word;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Phrase extends Model
{
    protected $guarded = [];

    public function words(): BelongsToMany {
        return $this->belongsToMany(Word::class);
    }
}
