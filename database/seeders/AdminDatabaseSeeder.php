<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'dancedreck456@gmail.com',
            'password' => bcrypt('1234'),
            'role' => 'admin',
        ]);
    }
}
