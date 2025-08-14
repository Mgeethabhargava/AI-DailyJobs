import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'core/app.dart';
import 'core/di/injection_container.dart';
import 'data/models/job.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp();
  
  // Initialize Hive
  await Hive.initFlutter();
  Hive.registerAdapter(JobAdapter());
  
  // Initialize dependencies
  await initializeDependencies();
  
  runApp(const JobAggregatorApp());
}