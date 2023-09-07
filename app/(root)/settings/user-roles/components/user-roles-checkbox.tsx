import {Checkbox} from "@/components/ui/checkbox";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {TableCell} from "@/components/ui/table";
import React from "react";
import {ApiPermission, ApiUserRole} from "@/types/user";
import {Loader} from "lucide-react";


type UserRoleCheckboxProps = {
    userRole: ApiUserRole
    permission: ApiPermission,
    onRefresh: () => Promise<void> | void
}
export const UserRolesCheckbox = ({userRole, permission, onRefresh}: UserRoleCheckboxProps) => {
    const [loading, setLoading] = React.useState(false);
    return (
        <TableCell key={userRole.id}>
            {loading ? <Loader className="animate-spin w-4 h-4"/> : (
                <Checkbox
                    checked={userRole.user_role_permissions.some((userRolePermission) => {
                        return userRolePermission.permissionsId === permission.id;
                    })}
                    onCheckedChange={async (checked) => {
                        setLoading(true);
                        if (checked) {
                            try {
                                await axios.post(`/api/users/roles/${userRole.id}/permissions/${permission.id}`);
                                toast.success(`Added "${permission.readable_name}" to "${userRole.readable_name}"`);
                            } catch (error) {
                                if (error instanceof AxiosError)
                                    toast.error(`Error adding "${permission.readable_name}" to "${userRole.readable_name}": ${error.response?.data.message}`);
                                else
                                    toast.error(`Error adding "${permission.readable_name}" to "${userRole.readable_name}"`);

                            }

                        } else {
                            try {
                                await axios.delete(`/api/users/roles/${userRole.id}/permissions/${permission.id}`);
                                toast.success(`Removed "${permission.readable_name}" from "${userRole.readable_name}"`);
                            } catch (error) {
                                if (error instanceof AxiosError)
                                    toast.error(`Error removing "${permission.readable_name}" from "${userRole.readable_name}": ${error.response?.data.message}`);
                                else
                                    toast.error(`Error removing "${permission.readable_name}" from "${userRole.readable_name}"`);

                            }
                        }

                        await onRefresh();
                        setLoading(false);
                    }}
                />
            )}
        </TableCell>
    );
};
