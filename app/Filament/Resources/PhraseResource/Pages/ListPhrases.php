<?php

namespace App\Filament\Resources\PhraseResource\Pages;

use App\Filament\Resources\PhraseResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPhrases extends ListRecords
{
    protected static string $resource = PhraseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
