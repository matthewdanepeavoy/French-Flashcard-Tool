<?php

namespace App\Filament\Resources\SentenceResource\Pages;

use App\Filament\Resources\SentenceResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSentence extends EditRecord
{
    protected static string $resource = SentenceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
