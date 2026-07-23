import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PublicIcon from "@mui/icons-material/Public";
import BusinessIcon from "@mui/icons-material/Business";
import { useCallback, useEffect, useState } from "react";
import { useToken } from "../authentication/components/useToken";
import Spinner from "../shared/buttons/Spinner";
import { closeRoleError, deleteRole, loadRoles } from "../../store/slices/roles";
import { loadPermissions } from "../../store/slices/permissions";
import React from "react";
import { useTranslation } from "react-i18next";
import AddRole from "./components/AddRole";
import EditRolePermissions from "./components/EditRolePermissions";
import { Role } from "../../types/roles";
import { AppDispatch, getPermission, getRole } from "../../store/store";
import Delete from "../shared/buttons/Delete";
import { CanEdit, CanDelete, ReadOnlyBanner } from "../shared/permissions";
import MainCard from "../../Berry/ui-component/cards/MainCard";

const Roles: React.FC = () => {
  const { t } = useTranslation();
  const [addOpen, setAddOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [token] = useToken("");
  const role = useSelector(getRole);
  const { list: permissions } = useSelector(getPermission);

  const fetchRoles = useCallback(async () => {
    await dispatch(loadRoles(token));
  }, [dispatch, token]);

  const fetchPermissions = useCallback(async () => {
    await dispatch(loadPermissions(token));
  }, [dispatch, token]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  if (role?.loading) return <Spinner />;
  if (role?.error) return <div>Error: {role?.error}</div>;

  return (
    <Box p={3}>
      {role?.processError && (
        <Snackbar
          open={Boolean(role?.processError)}
          autoHideDuration={6000}
          onClose={() => dispatch(closeRoleError())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => dispatch(closeRoleError())}
            severity="error"
            sx={{ width: "100%" }}
          >
            {role?.processError}
          </Alert>
        </Snackbar>
      )}

      <AddRole open={addOpen} onClose={() => setAddOpen(false)} />
      <EditRolePermissions role={editingRole} onClose={() => setEditingRole(null)} />

      {/* Page header */}
      <Box mb={2}>
        <Typography variant="h4" fontWeight="bold">
          {t("roles.title", "Roles")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("roles.subtitle", "Configure roles and assign permissions")}
        </Typography>
      </Box>

      <ReadOnlyBanner feature="roles" />

      <MainCard
        border
        boxShadow
        title={t("roles.title", "Roles")}
        secondary={
          <CanEdit feature="roles">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddOpen(true)}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              {t("roles.addRole", "New Role")}
            </Button>
          </CanEdit>
        }
      >
        {/* Role cards */}
        <Stack spacing={2}>
          {role?.list.map((r: Role) => {
            const permLabels = (r.permissions ?? []).map(
              (key) => permissions.find((p) => p.key === key)?.label ?? key
            );

            return (
              <Paper
                key={r._id}
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  p: 2.5,
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  {/* Left: name + badge */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {r.name}
                      </Typography>
                      <Tooltip
                        title={
                          r.isGlobal
                            ? t("roles.scopeGlobalTooltip", "Applies everywhere")
                            : t("roles.scopeStandardTooltip", "A standard role")
                        }
                      >
                        <Chip
                          icon={
                            r.isGlobal ? (
                              <PublicIcon sx={{ fontSize: 14 }} />
                            ) : (
                              <BusinessIcon sx={{ fontSize: 14 }} />
                            )
                          }
                          label={r.isGlobal ? t("roles.scopeGlobal", "Global") : t("roles.scopeStandard", "Standard")}
                          size="small"
                          color={r.isGlobal ? "primary" : "default"}
                          variant="outlined"
                          sx={{ height: 22, fontSize: "0.7rem" }}
                        />
                      </Tooltip>
                    </Box>

                    {/* Permission chips */}
                    {permLabels.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {permLabels.map((label) => (
                          <Chip key={label} label={label} size="small" variant="outlined" sx={{ fontSize: "0.72rem" }} />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.disabled">
                        {t("roles.noPermissions", "No permissions")}
                      </Typography>
                    )}
                  </Box>

                  {/* Right: actions */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 28, alignSelf: "center" }} />
                    <CanEdit feature="roles">
                      <Tooltip title={t("common.edit", "Edit")}>
                        <IconButton
                          size="small"
                          onClick={() => setEditingRole(r)}
                          sx={{ color: "primary.main" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </CanEdit>
                    <CanDelete feature="roles">
                      <Delete
                        title={t("roles.deleteTitle", "Delete role")}
                        onConfirm={() => dispatch(deleteRole(token, r._id))}
                      />
                    </CanDelete>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      </MainCard>
    </Box>
  );
};

export default Roles;
