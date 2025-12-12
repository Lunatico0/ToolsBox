"use client";

import { AuthPanel } from "./components/AuthPanel";
import { Header } from "./components/Header";
import { MessageBanner } from "./components/MessageBanner";
import { RequestForm } from "./components/RequestForm";
import { RequestsBoard } from "./components/RequestsBoard";
import { ToolForm } from "./components/ToolForm";
import { ToolsTable } from "./components/ToolsTable";
import { UserForm } from "./components/UserForm";
import { UsersTable } from "./components/UsersTable";
import { useInventoryDashboard } from "../hooks/useInventoryDashboard";

export function Dashboard() {
  const {
    adminName,
    tools,
    users,
    loading,
    message,
    error,
    toolForm,
    userForm,
    requestForm,
    authForm,
    approvers,
    returnNotes,
    availableTools,
    pendingRequests,
    activeAssignments,
    demoMode,
    setToolForm,
    setUserForm,
    setRequestForm,
    setAuthForm,
    setApprovers,
    setReturnNotes,
    handleLogin,
    handleLogout,
    handleCreateTool,
    handleCreateUser,
    handleCreateRequest,
    handleApprove,
    handleReturn,
    toolSelection,
  } = useInventoryDashboard();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Header
          adminName={adminName}
          demoMode={demoMode}
          tools={tools}
          pendingRequests={pendingRequests}
          activeAssignments={activeAssignments}
        />

        <MessageBanner message={message} error={error} />

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <AuthPanel
            adminName={adminName}
            authForm={authForm}
            setAuthForm={setAuthForm}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
          <ToolForm toolForm={toolForm} setToolForm={setToolForm} onSubmit={handleCreateTool} />
          <UserForm userForm={userForm} setUserForm={setUserForm} onSubmit={handleCreateUser} />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <RequestForm
            requestForm={requestForm}
            setRequestForm={setRequestForm}
            availableTools={availableTools}
            onToggleTool={toolSelection}
            onSubmit={handleCreateRequest}
          />
          <div className="lg:col-span-2">
            <RequestsBoard
              pendingRequests={pendingRequests}
              activeAssignments={activeAssignments}
              approvers={approvers}
              returnNotes={returnNotes}
              setApprovers={setApprovers}
              setReturnNotes={setReturnNotes}
              onApprove={handleApprove}
              onReturn={handleReturn}
            />
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <ToolsTable tools={tools} />
          <UsersTable users={users} />
        </section>

        {loading && <p className="mt-4 text-sm text-slate-500">Cargando datos...</p>}
      </div>
    </main>
  );
}
