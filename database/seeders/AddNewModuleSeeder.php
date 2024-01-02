<?php
namespace DatabaseSeeders;

use App\Models\Module;
use App\Models\Role;
use Illuminate\Database\Seeder;

class AddNewModuleSeeder extends Seeder
{
    protected $newModulesToAdd = [
        [
            'id' => 1,
            'module_key' => 'admin_profile',
            'module_name' => 'Admin Profile',
            'icon' => 'ti-user',
            'parent_id' => 0,
        ],
    ];
    protected $newRolesToAdd = [
        [
            'id' => 24,
            'role_name' => 'Repayment Maker',
            'role_title' => 'Repayment Maker',
            'Status' => 1,
        ],
        [
            'id' => 25,
            'role_name' => 'Repayment Checker',
            'role_title' => 'Repayment Checker',
            'Status' => 1,
        ]
    ];
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        foreach($this->newModulesToAdd as $module) {
            $this->command->comment("Adding " . $module['module_name'] . " to Modules...");
            if(!Module::where('module_key', $module['module_key'])->exists()) {
                Module::create($module);
                $this->command->info("Added " . $module['module_name'] . " to Modules");
            } else {
                $this->command->info($module['module_name'] . " already present");
            }
        }
        foreach($this->newRolesToAdd as $role) {
            $this->command->comment("Adding Role " . $role['role_name']);
            if(!Role::where('id', $role['id'])->exists()) {
                Role::create($role);
                $this->command->info("Added " . $role['role_name'] . " to Roles");
            } else {
                $this->command->info($role['id'] . " already present");
            }
        }
    }

}
