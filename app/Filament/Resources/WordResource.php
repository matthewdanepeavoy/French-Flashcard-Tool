<?php

namespace App\Filament\Resources;

use Filament\Forms;
use App\Models\Word;
use Filament\Tables;
use App\Enums\WordType;
use Filament\Forms\Get;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\Placeholder;
use App\Filament\Resources\WordResource\Pages;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\RelationManagers\RelationManager;
use App\Filament\Resources\WordResource\RelationManagers;
use App\Filament\Resources\WordResource\RelationManagers\PhrasesRelationManager;

class WordResource extends Resource
{
    protected static ?string $model = Word::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?int $navigationSort = 1;
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('details')
                    ->columns(3)
                    ->schema([
                        Forms\Components\TextInput::make('word')
                            ->label('Masculine form')
                            ->autofocus()
                            ->required(),

                        Forms\Components\TextInput::make('definition')
                            ->required(),

                        Select::make('type')
                            ->options(WordType::class)
                            ->native(false)
                            ->preload()
                            ->default('noun')
                            ->searchable()
                            ->required()
                            ->live(),



                        Forms\Components\TextInput::make('feminine_form'),
                        Forms\Components\TextInput::make('contracted_form'),
                        Forms\Components\TextInput::make('hints'),
                        Select::make('tags')
                            ->relationship('tags', titleAttribute: 'name')
                            ->searchDebounce(10)
                            ->searchable()
                            ->multiple()
                            ->preload(),
                    ]),



                Section::make('conjugations')
                    ->hidden(function(Get $get) {
                        if ($get('type') == 'verb') return false;
                        return true;
                    })
                    ->columns(3)
                    ->schema([
                        TextInput::make('je')
                            ->formatStateUsing(function($record) {
                                if ($record?->conjugations) return $record?->conjugations[0];
                            }),
                        TextInput::make('tu')
                            ->formatStateUsing(function($record) {
                                if ($record?->conjugations) return $record?->conjugations[1];
                            }),
                        TextInput::make('il/elle')
                            ->formatStateUsing(function($record) {
                                if ($record?->conjugations) return $record?->conjugations[2];
                            }),
                        TextInput::make('nous')
                            ->formatStateUsing(function($record) {
                                if ($record?->conjugations) return $record?->conjugations[3];
                            }),
                        TextInput::make('vous')
                            ->formatStateUsing(function($record) {
                                if ($record?->conjugations) return $record?->conjugations[4];
                            }),

                        TextInput::make('ils/elles')
                            ->formatStateUsing(function($record) {
                                if ($record?->conjugations) return $record?->conjugations[5];
                            }),

                        Placeholder::make('Conditional Present')
                            ->columnSpanFull()
                            ->content('Expresses wishes, or make polite requests'),

                        TextInput::make('cp_je')
                            ->formatStateUsing(function ($record) {
                                if ($record?->conjugations && isset($record?->conjugations['cp_je']))
                                    return $record?->conjugations['cp_je'];
                            }),
                        TextInput::make('cp_tu')
                            ->formatStateUsing(function ($record) {
                                if ($record?->conjugations && isset($record?->conjugations['cp_tu']))
                                    return $record?->conjugations['cp_tu'];
                            }),
                        TextInput::make('cp_il/elle')
                            ->formatStateUsing(function ($record) {
                                if ($record?->conjugations && isset($record?->conjugations['cp_il/elle']))
                                    return $record?->conjugations['cp_il/elle'];
                            }),
                        TextInput::make('cp_nous')
                            ->formatStateUsing(function ($record) {
                                if ($record?->conjugations && isset($record?->conjugations['cp_nous']))
                                    return $record?->conjugations['cp_nous'];
                            }),
                        TextInput::make('cp_vous')
                            ->formatStateUsing(function ($record) {
                                if ($record?->conjugations && isset($record?->conjugations['cp_vous']))
                                    return $record?->conjugations['cp_vous'];
                            }),

                        TextInput::make('cp_ils/elles')
                            ->formatStateUsing(function ($record) {
                                if ($record?->conjugations && isset($record?->conjugations['cp_ils/elles']))
                                    return $record?->conjugations['cp_ils/elles'];
                            }),


                    ]),
                // Forms\Components\Textarea::make('conjugations')
                    // ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->headerActions([
                // Tables\Actions\CreateAction::make(),  // ✅ Add "Create"
                Tables\Actions\AttachAction::make()
                    ->visible(fn($livewire) => $livewire instanceof RelationManager),  // ✅ Add "Attach" (for BelongsToMany)
            ])
            ->columns([
                Tables\Columns\TextColumn::make('word')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('definition'),
                Tables\Columns\TextColumn::make('type'),
                Tables\Columns\TextColumn::make('hints'),
                Tables\Columns\TextColumn::make('conjugations')
                    ->limit(100)
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
                Tables\Actions\DetachAction::make()
                    ->visible(fn($livewire) => $livewire instanceof RelationManager),
                // ✅ Add "Attach" (for BelongsToMany)
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            PhrasesRelationManager::class
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
