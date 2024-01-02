<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CreateUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Manu Parmar',
                'email' => 'manuparmar555@gmail.com',
                'password' => bcrypt("Test@1234"),
                'is_admin' => 1,
                'role_id' => 1,
            ],
        ];
        foreach($users as $user) {
            $this->command->comment("Adding User " . $user['name'] . " to ...");
            if(!User::where('email', $user['email'])->exists()) {
                User::create($user);
                $this->command->info("Added " . $user['name'] . " to Users");
            } else {
                $this->command->info($user['name'] . " already present");
            }
        }
    }
}
