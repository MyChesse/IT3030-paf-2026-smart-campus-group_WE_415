import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  PresentationChartBarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      icon: <AcademicCapIcon className="h-7 w-7" />,
      title: 'Facilities Directory',
      description:
        'Browse lecture halls, labs, and meeting rooms with live availability and hardware details.',
    },
    {
      icon: <ClipboardDocumentListIcon className="h-7 w-7" />,
      title: 'Smart Booking Flow',
      description:
        'Pick your space, review seats/projector/camera availability, and confirm in one flow.',
    },
    {
      icon: <PresentationChartBarIcon className="h-7 w-7" />,
      title: 'Admin Controls',
      description:
        'Add and update items/units quickly with clear confirmations before every critical action.',
    },
    {
      icon: <ShieldCheckIcon className="h-7 w-7" />,
      title: 'Reliable Data Sync',
      description:
        'All catalog updates are backed by your database so user and admin views always match.',
    },
  ];

  return (
    <div className="min-h-screen bg-campus-surface text-slate-100">
      <header className="sticky top-0 z-40 border-b border-campus-line/70 bg-campus-surface/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="text-xl font-bold tracking-wide text-campus-accent"
            onClick={() => navigate('/')}
          >
            Smart Campus
          </button>

          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="rounded-xl border border-campus-line px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-campus-accent hover:text-campus-accent"
              onClick={() => navigate('/facilities')}
            >
              Facilities
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-center lg:px-8 lg:pt-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-campus-accent">
              Campus Operations Platform
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              One Dashboard for
              <span className="block text-campus-accent">Smart Space Booking</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
              Manage campus resources with a unified experience. Students and staff can
              discover available spaces, while admins maintain accurate facility and unit data
              with safe confirmation prompts.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-2xl bg-campus-accent px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-campus-accent-strong"
                onClick={() => navigate('/facilities')}
              >
                Book a Facility
              </button>
              <button
                type="button"
                className="rounded-2xl border border-campus-line bg-campus-card px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-campus-accent"
                onClick={() => navigate('/facilities-overview')}
              >
                Explore Facilities
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-campus-line bg-campus-card p-6 shadow-campus">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-campus-accent">
              Snapshot
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-campus-line bg-campus-surface/80 p-4 text-center">
                <p className="text-2xl font-bold text-campus-accent">3</p>
                <p className="mt-1 text-xs text-slate-300">Sections</p>
              </div>
              <div className="rounded-2xl border border-campus-line bg-campus-surface/80 p-4 text-center">
                <p className="text-2xl font-bold text-campus-accent">Live</p>
                <p className="mt-1 text-xs text-slate-300">Availability</p>
              </div>
              <div className="rounded-2xl border border-campus-line bg-campus-surface/80 p-4 text-center">
                <p className="text-2xl font-bold text-campus-accent">DB</p>
                <p className="mt-1 text-xs text-slate-300">Synced</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-300">
              Designed to match your Facilities and Admin pages for a consistent experience
              across the full app.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-campus-line bg-campus-card p-7 shadow-campus-soft">
            <h2 className="text-2xl font-bold sm:text-3xl">Core Modules</h2>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Consistent design language, clear actions, and practical booking workflows.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {modules.map((module) => (
                <article
                  key={module.title}
                  className="rounded-2xl border border-campus-line bg-campus-surface/85 p-4 transition hover:-translate-y-0.5 hover:border-campus-accent/70"
                >
                  <div className="mb-3 inline-flex rounded-xl bg-campus-accent/15 p-2 text-campus-accent">
                    {module.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{module.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-campus-line/70 bg-campus-surface/90 py-5 text-center text-sm text-slate-400">
        Smart Campus 2026 | Consistent booking and administration experience
      </footer>
    </div>
  );
};

export default Home;