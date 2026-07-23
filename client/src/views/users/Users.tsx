import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { useToken } from "../authentication/components/useToken";
import { useUser } from "../authentication/components/useUser";
import { loadUsers, deleteUser, closeError } from "../../store/slices/users";
import { loadRoles } from "../../store/slices/roles";
import { AppDispatch, getUser, getRole } from "../../store/store";
import { User } from "../../types/users";
import Spinner from "../shared/buttons/Spinner";
import Delete from "../shared/buttons/Delete";
import { CanEdit, CanDelete, FeatureUiGate, ReadOnlyBanner } from "../shared/permissions";
import MainCard from "../../Berry/ui-component/cards/MainCard";
import UserFormDialog from "./components/UserFormDialog";

const Users: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [token] = useToken("");
  const currentUser = useUser();
  const users = useSelector(getUser);
  const roleState = useSelector(getRole);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    await dispatch(loadUsers(token));
  }, [dispatch, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (roleState?.list.length === 0) dispatch(loadRoles(token));
  }, [dispatch, token, roleState?.list.length]);

  return (
    <FeatureUiGate
      feature="users"
      fallback={
        <Box p={3}>
          <Alert severity="warning">
            {t("users.noAccess", "You don't have permission to view users.")}
          </Alert>
        </Box>
      }
    >
      <Box p={3}>
        <Box mb={2}>
          <Typography variant="h4" fontWeight="bold">
            {t("users.title", "Users")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("users.subtitle", "People with an account on Kimorah")}
          </Typography>
        </Box>

        <ReadOnlyBanner feature="users" />

        {users?.processError && (
          <Snackbar
            open={Boolean(users?.processError)}
            autoHideDuration={6000}
            onClose={() => dispatch(closeError())}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => dispatch(closeError())} severity="error" sx={{ width: "100%" }}>
              {users?.processError}
            </Alert>
          </Snackbar>
        )}

        <UserFormDialog
          open={Boolean(editUser)}
          onClose={() => setEditUser(null)}
          user={editUser ?? undefined}
          roles={roleState?.list ?? []}
        />

        {users?.loading ? (
          <Spinner />
        ) : (
          <MainCard border boxShadow title={t("users.title", "Users")}>
            <Stack spacing={2}>
              {users?.list.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  {t("users.empty", "No users yet.")}
                </Typography>
              )}
              {users?.list.map((u: User) => {
                const isSelf = u._id === currentUser?.id;
                return (
                  <Paper
                    key={u._id}
                    elevation={0}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      "&:hover": { boxShadow: 3 },
                      transition: "box-shadow 0.2s",
                    }}
                  >
                    <PersonRoundedIcon sx={{ color: "primary.main" }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {u.name}
                        {isSelf && (
                          <Chip label={t("users.you", "you")} size="small" sx={{ ml: 1, height: 18, fontSize: "0.65rem" }} />
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {u.email}
                      </Typography>
                    </Box>
                    {u.roles && <Chip label={u.roles} size="small" variant="outlined" color="primary" />}
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 28, alignSelf: "center" }} />
                    <CanEdit feature="users">
                      <Tooltip title={t("common.edit", "Edit")}>
                        <IconButton size="small" onClick={() => setEditUser(u)} sx={{ color: "primary.main" }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </CanEdit>
                    {!isSelf && (
                      <CanDelete feature="users">
                        <Delete
                          title={t("users.deleteTitle", "Delete user")}
                          onConfirm={() => dispatch(deleteUser(token, u._id))}
                        />
                      </CanDelete>
                    )}
                  </Paper>
                );
              })}
            </Stack>
          </MainCard>
        )}
      </Box>
    </FeatureUiGate>
  );
};

export default Users;
