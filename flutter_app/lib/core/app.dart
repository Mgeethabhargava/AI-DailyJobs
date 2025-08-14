import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../features/jobs/presentation/blocs/jobs_bloc.dart';
import '../features/jobs/presentation/pages/jobs_page.dart';
import '../features/jobs/presentation/pages/job_detail_page.dart';
import '../features/settings/presentation/pages/settings_page.dart';
import 'di/injection_container.dart';
import 'theme/app_theme.dart';

class JobAggregatorApp extends StatelessWidget {
  const JobAggregatorApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => sl<JobsBloc>()),
      ],
      child: MaterialApp.router(
        title: 'Job Aggregator',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        routerConfig: _router,
        debugShowCheckedModeBanner: false,
      ),
    );
  }

  static final _router = GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const JobsPage(),
      ),
      GoRoute(
        path: '/job/:id',
        builder: (context, state) {
          final jobId = state.pathParameters['id']!;
          return JobDetailPage(jobId: jobId);
        },
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsPage(),
      ),
    ],
  );
}