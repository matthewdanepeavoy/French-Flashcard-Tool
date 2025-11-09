<?php
namespace App\Enums;

enum PhraseType: string
{
    case Basic = 'Basic';
    case Question = 'Question';
    case Frequency = 'Frequency';
    case Weather = 'Weather';
    case Seasons = 'Seasons';
    case Describers = 'Describers';
    case Household = 'Household';
}
