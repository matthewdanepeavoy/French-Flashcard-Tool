<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PhraseResource\Pages;
use App\Filament\Resources\PhraseResource\RelationManagers;
use App\Models\Phrase;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PhraseResource extends Resource
{
    protected static ?string $model = Phrase::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('french')
                    ->required(),
                Forms\Components\TextInput::make('english')
                    ->required(),
                Forms\Components\TextInput::make('correct_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                Forms\Components\TextInput::make('error_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                Forms\Components\Toggle::make('mastered')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('french')
                    ->searchable(),
                Tables\Columns\TextColumn::make('english')
                    ->searchable(),
                Tables\Columns\TextColumn::make('correct_count')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('error_count')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\IconColumn::make('mastered')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPhrases::route('/'),
            'create' => Pages\CreatePhrase::route('/create'),
            'edit' => Pages\EditPhrase::route('/{record}/edit'),
        ];
    }
}
