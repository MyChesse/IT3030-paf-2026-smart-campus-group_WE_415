# IT3030-paf-2026-smart-campus-group_WE_415

## Backend Startup

Use the backend helper script when port 8081 is already occupied or when you want a consistent one-command startup flow.

From the backend folder:

```powershell
.\start-backend.ps1
```

Or use the Windows wrapper:

```cmd
.\start-backend.cmd
```

The script will stop an existing Java process listening on port 8081, confirm the port is free, and then run `mvn spring-boot:run`.

Useful options:

```powershell
.\start-backend.ps1 -DryRun
.\start-backend.ps1 -NoRun
.\start-backend.ps1 -AllowNonJavaKill
```

`-DryRun` shows what would happen without stopping anything. `-NoRun` frees the port but does not start the app. `-AllowNonJavaKill` should only be used if you deliberately want to stop a non-Java process on port 8081.
