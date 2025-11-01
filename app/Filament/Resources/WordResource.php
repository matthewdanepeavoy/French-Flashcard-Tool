<?php

namespace App\Filament\Resources;

use Filament\Forms;
use App\Models\Word;
use Filament\Tables;
use Filament\Forms\Get;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Builder;
use App\Filament\Resources\WordResource\Pages;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\WordResource\RelationManagers;

class WordResource extends Resource
{
    protected static ?string $model = Word::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('word')
                    ->required(),
                Select::make('type')
                    ->options(function($state) {
                        return [
                            'Verb' => 'Verb'
                        ];
                    })
                    ->live(),
                Forms\Components\TextInput::make('hints'),

                Section::make('conjugations')
                    ->hidden(function(Get $get) {
                        if ($get('type') == 'Verb') return false;
                        return true;
                    })
                    ->columns(3)
                    ->schema([
                        TextInput::make('je')
                            ->formatStateUsing(function($record) {
                                if (isset($record->conjugations['je'])) {
                                    return $record->conjugations['je'];
                                }
                            }),
                        TextInput::make('tu')
                            ->formatStateUsing(function($record) {
                                // dd($record);
                            }),
                        TextInput::make('il/elle')
                            ->formatStateUsing(function($record) {
                                // dd($record);
                            }),
                        TextInput::make('vous')
                            ->formatStateUsing(function($record) {
                                // dd($record);
                            }),
                        TextInput::make('nous')
                            ->formatStateUsing(function($record) {
                                // dd($record);
                            }),
                        TextInput::make('ils/elles')
                            ->formatStateUsing(function($record) {
                                // dd($record);
                            }),
                    ]),
                // Forms\Components\Textarea::make('conjugations')
                    // ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('word')
                    ->searchable(),
                Tables\Columns\TextColumn::make('type')
                    ->searchable(),
                Tables\Columns\TextColumn::make('hints')
                    ->searchable(),
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
            'index' => Pages\ListWords::route('/'),
            'create' => Pages\CreateWord::route('/create'),
            'edit' => Pages\EditWord::route('/{record}/edit'),
        ];
    }
}
