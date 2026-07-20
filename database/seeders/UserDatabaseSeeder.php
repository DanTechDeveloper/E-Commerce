<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        User::create([
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        User::create([
            'name' => 'Pedro Reyes',
            'email' => 'pedro@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);
    }
}
