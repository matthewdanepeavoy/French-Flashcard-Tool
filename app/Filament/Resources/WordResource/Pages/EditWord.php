<?php

namespace App\Filament\Resources\WordResource\Pages;

use App\Filament\Resources\WordResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditWord extends EditRecord
{
    protected static string $resource = WordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['je'])) {
            $data['conjugations'] = [
                $data['je'],
                $data['tu'],
                $data['il/elle'],
                $data['nous'],
                $data['vous'],
                $data['ils/elles'],
            ];

            unset($data['je']);
            unset($data['tu']);
            unset($data['il/elle']);
            unset($data['nous']);
            unset($data['vous']);
            unset($data['ils/elles']);
        }

        return $data;
    }
}
