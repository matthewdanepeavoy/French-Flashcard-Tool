<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Story;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    public function add()
    {
        return Inertia::render('StoryAdd', [

        ]);
    }

    public function post(Request $request) {
        $story = Story::create([
            'name' => $request->title,
        ]);

        foreach($request->sentences as $index => $sentence) {
            $story->sentences()->create([
                'english' => $sentence['english'],
                'translated' => $sentence['translated'],
                'order' => $index
            ]);
        }

        // We also need to have a story title added here.

        // Save it in ORDER with the order ID.


        return back();
    }
}
