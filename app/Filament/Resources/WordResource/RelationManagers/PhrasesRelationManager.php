<?php

namespace App\Filament\Resources\WordResource\RelationManagers;

use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use App\Filament\Resources\PhraseResource;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\RelationManagers\RelationManager;

class PhrasesRelationManager extends RelationManager
{
    protected static string $relationship = 'phrases';

    public function form(Form $form): Form
    {
        return PhraseResource::form($form);
    }

    public function table(Table $table): Table
    {
        return PhraseResource::table($table);
    }
}
