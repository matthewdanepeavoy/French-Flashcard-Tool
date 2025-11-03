<?php
namespace App\Enums;
enum WordType: string
{
    case Verb = 'verb';
    case Noun = 'noun';
    case Pronoun = 'pronoun';
    case Adjective = 'adjective';
    case Adverb = 'adverb';
    case Article = 'article';
}
