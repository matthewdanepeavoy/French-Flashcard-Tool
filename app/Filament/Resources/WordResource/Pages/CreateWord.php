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


    protected function mutateFormDataBeforeCreate(array $data): array
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


            // Conditional present (politeness verbs)
            if ($data['cp_je']) {
                $data['conjugations']['cp_je'] = $data['cp_je'];
                $data['conjugations']['cp_tu'] = $data['cp_tu'];
                $data['conjugations']['cp_il/elle'] = $data['cp_il/elle'];
                $data['conjugations']['cp_nous'] = $data['cp_nous'];
                $data['conjugations']['cp_vous'] = $data['cp_vous'];
                $data['conjugations']['cp_ils/elles'] = $data['cp_ils/elles'];
            }
        }

        unset($data['je']);
        unset($data['tu']);
        unset($data['il/elle']);
        unset($data['nous']);
        unset($data['vous']);
        unset($data['ils/elles']);

        unset($data['cp_je']);
        unset($data['cp_tu']);
        unset($data['cp_il/elle']);
        unset($data['cp_nous']);
        unset($data['cp_vous']);
        unset($data['cp_ils/elles']);

        return $data;
    }
}
