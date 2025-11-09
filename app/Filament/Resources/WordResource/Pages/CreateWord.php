<?php

namespace App\Filament\Resources\WordResource\Pages;

use App\Filament\Resources\WordResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateWord extends CreateRecord
{
    protected static string $resource = WordResource::class;

    protected function getRedirectUrl(): string
    {
        // Redirect to the index (list) page of the same resource
        return $this->getResource()::getUrl('create');
    }
}
