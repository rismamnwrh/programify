import { Inertia } from '@inertiajs/inertia';
// @ts-ignore
import { InertiaLink, Head } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React, { Fragment, PropsWithChildren, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import ApplicationMark from '@Components/ApplicationMark';
import Banner from '@Components/Banner';
import Dropdown from '@Components/Dropdown';
import DropdownLink from '@Components/DropdownLink';
import NavLink from '@Components/NavLink';
import ResponsiveNavLink from '@Components/ResponsiveNavLink';
import { Team } from '@/types';
import { Menu, Transition } from '@headlessui/react';
import { Toaster } from 'react-hot-toast';

interface Props {
  title: string;
  renderHeader?(): JSX.Element;
}

export default function AppLayout({
  title,
  renderHeader,
  children,
}: PropsWithChildren<Props>) {
  const page = useTypedPage();
  const route = useRoute();
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  function switchToTeam(e: React.FormEvent, team: Team) {
    e.preventDefault();
    Inertia.put(
      route('current-team.update'),
      {
        team_id: team.id,
      },
      {
        preserveState: false,
      },
    );
  }

  function logout(e: React.FormEvent) {
    e.preventDefault();
    Inertia.post(route('logout'));
  }

  return (
    <div>
      <Head title={title} />

      <Banner />
      <Toaster position="bottom-right" />
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100">
          {/* <!-- Primary Navigation Menu --> */}
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                {/* <!-- Logo --> */}
                <div className="flex flex-shrink-0 items-center">
                  <InertiaLink href={route('dashboard')}>
                    <ApplicationMark className="block w-auto h-9" />
                  </InertiaLink>
                </div>

                {/* <!-- Navigation Links --> */}
                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                  <NavLink
                    href={route('dashboard')}
                    active={route().current('dashboard')}
                  >
                    Dashboard
                  </NavLink>
                </div>
              </div>

              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <div className="relative ml-3">
                  {/* <!-- Teams Dropdown --> */}
                  {page.props.jetstream.hasTeamFeatures ? (
                    <Dropdown
                      align="right"
                      width="60"
                      renderTrigger={() => (
                        <span className="inline-flex rounded-md">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 bg-white rounded-md border border-transparent transition hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:bg-gray-50 active:bg-gray-50"
                          >
                            {page.props.user.current_team?.name}

                            <svg
                              className="ml-2 -mr-0.5 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      )}
                    >
                      <div className="w-60">
                        {/* <!-- Team Management --> */}
                        {page.props.jetstream.hasTeamFeatures ? (
                          <>
                            <div className="block px-4 py-2 text-xs text-gray-400">
                              Manage Team
                            </div>

                            {/* <!-- Team Settings --> */}
                            <DropdownLink
                              href={route('teams.show', [
                                page.props.user.current_team!,
                              ])}
                            >
                              Team Settings
                            </DropdownLink>

                            {page.props.jetstream.canCreateTeams ? (
                              <DropdownLink href={route('teams.create')}>
                                Create New Team
                              </DropdownLink>
                            ) : null}

                            <div className="border-t border-gray-100"></div>

                            {/* <!-- Team Switcher --> */}
                            <div className="block px-4 py-2 text-xs text-gray-400">
                              Switch Teams
                            </div>

                            {page.props.user.all_teams?.map(team => (
                              <form
                                onSubmit={e => switchToTeam(e, team)}
                                key={team.id}
                              >
                                <DropdownLink as="button">
                                  <div className="flex items-center">
                                    {team.id ==
                                      page.props.user.current_team_id && (
                                      <svg
                                        className="mr-2 w-5 h-5 text-green-400"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                      </svg>
                                    )}
                                    <div>{team.name}</div>
                                  </div>
                                </DropdownLink>
                              </form>
                            ))}
                          </>
                        ) : null}
                      </div>
                    </Dropdown>
                  ) : null}
                </div>

                {/* <!-- Settings Dropdown --> */}
                <div className="relative ml-3">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-center w-full">
                        {page.props.jetstream.managesProfilePhotos ? (
                          <button className="flex text-sm rounded-full border-2 border-transparent transition focus:outline-none focus:border-gray-300">
                            <img
                              className="object-cover w-8 h-8 rounded-full"
                              src={page.props.user.profile_photo_url}
                              alt={page.props.user.name}
                            />
                          </button>
                        ) : (
                          <span className="inline-flex rounded-md">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 bg-white rounded-md border border-transparent transition hover:text-gray-700 focus:outline-none"
                            >
                              {page.props.user.name}

                              <svg
                                className="ml-2 -mr-0.5 h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </span>
                        )}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                          <Menu.Item>
                            {({ active }) => (
                              <InertiaLink
                                href={route('profile.show')}
                                className={`${
                                  active
                                    ? 'bg-primary-400 text-white'
                                    : 'text-gray-900'
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                              >
                                Profile
                              </InertiaLink>
                            )}
                          </Menu.Item>
                          {page.props.jetstream.hasApiFeatures ? (
                            <Menu.Item>
                              {({ active }) => (
                                <InertiaLink
                                  href={route('api-tokens.index')}
                                  className={`${
                                    active
                                      ? 'bg-primary-400 text-white'
                                      : 'text-gray-900'
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                >
                                  API Token
                                </InertiaLink>
                              )}
                            </Menu.Item>
                          ) : null}
                        </div>
                        <div className="px-1 py-1">
                          <form onSubmit={logout}></form>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                type="submit"
                                className={`${
                                  active
                                    ? 'bg-primary-400 text-white'
                                    : 'text-gray-900'
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                              >
                                Logout
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

              {/* <!-- Hamburger --> */}
              <div className="flex items-center -mr-2 sm:hidden">
                <button
                  onClick={() =>
                    setShowingNavigationDropdown(!showingNavigationDropdown)
                  }
                  className="inline-flex justify-center items-center p-2 text-gray-400 rounded-md transition hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                >
                  <svg
                    className="w-6 h-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className={classNames({
                        hidden: showingNavigationDropdown,
                        'inline-flex': !showingNavigationDropdown,
                      })}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                    <path
                      className={classNames({
                        hidden: !showingNavigationDropdown,
                        'inline-flex': showingNavigationDropdown,
                      })}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* <!-- Responsive Navigation Menu --> */}
          <div
            className={classNames('sm:hidden', {
              block: showingNavigationDropdown,
              hidden: !showingNavigationDropdown,
            })}
          >
            <div className="pt-2 pb-3 space-y-1">
              <ResponsiveNavLink
                href={route('dashboard')}
                active={route().current('dashboard')}
              >
                Dashboard
              </ResponsiveNavLink>
            </div>

            {/* <!-- Responsive Settings Options --> */}
            <div className="pt-4 pb-1 border-t border-gray-200">
              <div className="flex items-center px-4">
                {page.props.jetstream.managesProfilePhotos ? (
                  <div className="flex-shrink-0 mr-3">
                    <img
                      className="object-cover w-10 h-10 rounded-full"
                      src={page.props.user.profile_photo_url}
                      alt={page.props.user.name}
                    />
                  </div>
                ) : null}

                <div>
                  <div className="text-base font-medium text-gray-800">
                    {page.props.user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {page.props.user.email}
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <ResponsiveNavLink
                  href={route('profile.show')}
                  active={route().current('profile.show')}
                >
                  Profile
                </ResponsiveNavLink>

                {page.props.jetstream.hasApiFeatures ? (
                  <ResponsiveNavLink
                    href={route('api-tokens.index')}
                    active={route().current('api-tokens.index')}
                  >
                    API Tokens
                  </ResponsiveNavLink>
                ) : null}

                {/* <!-- Authentication --> */}
                <form method="POST" onSubmit={logout}>
                  <ResponsiveNavLink as="button">Log Out</ResponsiveNavLink>
                </form>

                {/* <!-- Team Management --> */}
                {page.props.jetstream.hasTeamFeatures ? (
                  <>
                    <div className="border-t border-gray-200"></div>

                    <div className="block px-4 py-2 text-xs text-gray-400">
                      Manage Team
                    </div>

                    {/* <!-- Team Settings --> */}
                    <ResponsiveNavLink
                      href={route('teams.show', [
                        page.props.user.current_team!,
                      ])}
                      active={route().current('teams.show')}
                    >
                      Team Settings
                    </ResponsiveNavLink>

                    {page.props.jetstream.canCreateTeams ? (
                      <ResponsiveNavLink
                        href={route('teams.create')}
                        active={route().current('teams.create')}
                      >
                        Create New Team
                      </ResponsiveNavLink>
                    ) : null}

                    <div className="border-t border-gray-200"></div>

                    {/* <!-- Team Switcher --> */}
                    <div className="block px-4 py-2 text-xs text-gray-400">
                      Switch Teams
                    </div>
                    {page.props.user?.all_teams?.map(team => (
                      <form onSubmit={e => switchToTeam(e, team)} key={team.id}>
                        <ResponsiveNavLink as="button">
                          <div className="flex items-center">
                            {team.id == page.props.user.current_team_id && (
                              <svg
                                className="mr-2 w-5 h-5 text-green-400"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            )}
                            <div>{team.name}</div>
                          </div>
                        </ResponsiveNavLink>
                      </form>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </nav>

        {/* <!-- Page Heading --> */}
        {renderHeader ? (
          <header className="bg-white shadow">
            <div className="px-4 py-5 mx-auto max-w-7xl sm:px-6 lg:px-8">
              {renderHeader()}
            </div>
          </header>
        ) : null}

        {/* <!-- Page Content --> */}
        <main>{children}</main>
      </div>
    </div>
  );
}
