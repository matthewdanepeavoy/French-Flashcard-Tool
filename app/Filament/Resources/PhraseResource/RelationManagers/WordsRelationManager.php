<?php

namespace App\Filament\Resources\PhraseResource\RelationManagers;

use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Form;
use Filament\Tables\Table;
use App\Filament\Resources\WordResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\RelationManagers\RelationManager;

class WordsRelationManager extends RelationManager
{
    protected static string $relationship = 'words';

    public function form(Form $form): Form
    {
        return WordResource::form($form);
    }

    public function table(Table $table): Table
    {
        return WordResource::table($table);
    }
}
