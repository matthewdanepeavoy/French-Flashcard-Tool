<?php

namespace App\Filament\Resources;

use Filament\Forms;
use Filament\Tables;
use App\Models\Phrase;
use Filament\Forms\Form;
use App\Enums\PhraseType;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Section;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;
use App\Filament\Resources\PhraseResource\Pages;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\PhraseResource\RelationManagers;
use App\Filament\Resources\PhraseResource\RelationManagers\WordsRelationManager;

class PhraseResource extends Resource
{
    protected static ?string $model = Phrase::class;
    protected static ?int $navigationSort = 1;
    protected static ?string $navigationGroup = 'Phrases';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Phrase')
                    ->columns(4)
                    ->schema([
                        Forms\Components\TextInput::make('phrase')
                            ->columnSpan(2)
                            ->required(),
                        Forms\Components\TextInput::make('english')
                            ->columnSpan(2)
                            ->required(),
                        Forms\Components\TextInput::make('hint'),
                        Select::make('type')
                            ->options(PhraseType::class)
                            ->preload()
                            ->searchable()
                            ->required(),
                        Forms\Components\TextInput::make('language')
                            ->required(),
                        Forms\Components\TextInput::make('level')
                            ->required(),

                    ]),

                Section::make('Meta Data')
                    ->columns(3)
                    ->schema([
                        Select::make('tags')
                            ->relationship('tags', titleAttribute: 'name')
                            ->searchable()
                            ->multiple()
                            ->searchDebounce(10)
                            ->preload(),
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
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('level')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phrase')
                    ->wrap()
                    ->searchable(),
                Tables\Columns\TextColumn::make('english')
                    ->wrap()
                    ->searchable(),
                Tables\Columns\TagsColumn::make('tags.name')
                    ->color('info')
                    ->label('Tags'),
                // Tables\Columns\TextColumn::make('correct_count')
                //     ->numeric()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('error_count')
                //     ->numeric()
                //     ->sortable(),
                TextColumn::make('words_count') // you can name it whatever you like
                    ->label('Words')
                    ->sortable()
                    ->counts('words') // counts the related models
                    ,
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

    public static function getTableQuery(): Builder
    {
        return parent::getTableQuery()
            ->withCount('words'); // 'associations' is your hasMany relationship
    }

    public static function getRelations(): array
    {
        return [
            WordsRelationManager::class
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
