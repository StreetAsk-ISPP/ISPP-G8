-- Initial full schema bootstrap for empty MySQL databases.
-- Generated from current JPA mappings and curated for Flyway V1.

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE IF NOT EXISTS `admins` (
  `assigned_at` datetime(6) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `permissions` longtext,
  `role` enum('CONTENT_MODERATOR','SUPER_ADMIN','SUPPORT') DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FKmdcmdfux7huk7frsm6uwxaqix` FOREIGN KEY (`id`) REFERENCES `appusers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `answer_reports` (
  `created_at` datetime(6) NOT NULL,
  `answer_id` binary(16) NOT NULL,
  `id` binary(16) NOT NULL,
  `reporter_id` binary(16) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `reason` enum('IRRELEVANT','OFFENSIVE','OTHER','SPAM') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_answer_report_reporter_answer` (`reporter_id`,`answer_id`),
  KEY `FKpuh7on2bgreqd5neqrgf6pdj6` (`answer_id`),
  CONSTRAINT `FK7ffaas7xgpnjj29kk96kaxs1x` FOREIGN KEY (`reporter_id`) REFERENCES `regular_users` (`id`),
  CONSTRAINT `FKpuh7on2bgreqd5neqrgf6pdj6` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `answer_votes` (
  `voted_at` datetime(6) DEFAULT NULL,
  `answer_id` binary(16) NOT NULL,
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `vote_type` enum('DISLIKE','LIKE') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKl223hnu6pfmo8mqs2qevejwuc` (`user_id`,`answer_id`),
  KEY `FKbxpmd373n8cndt4ruup9vesxt` (`answer_id`),
  CONSTRAINT `FKbxpmd373n8cndt4ruup9vesxt` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`),
  CONSTRAINT `FKeovt71gx6r5ts4eyxde7eguqq` FOREIGN KEY (`user_id`) REFERENCES `regular_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `answers` (
  `coins_earned` int DEFAULT NULL,
  `downvotes` int DEFAULT NULL,
  `is_verified` bit(1) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `upvotes` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `question_id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `content` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3erw1a3t0r78st8ty27x6v3g1` (`question_id`),
  KEY `FKd69sr7tl197vsdwfatvaw3mxy` (`user_id`),
  CONSTRAINT `FK3erw1a3t0r78st8ty27x6v3g1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  CONSTRAINT `FKd69sr7tl197vsdwfatvaw3mxy` FOREIGN KEY (`user_id`) REFERENCES `regular_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `appusers` (
  `active` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `authority` binary(16) NOT NULL,
  `id` binary(16) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `account_type` enum('ADMIN','BUSINESS','REGULAR_USER') DEFAULT NULL,
  `profile_picture_url` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoqn4ggihh230v2u56rnkaj88x` (`email`),
  UNIQUE KEY `UK2yjbdgqy9kgllwt2j4crp4n29` (`user_name`),
  KEY `FKgqebgjja4fdf7rww08icgsqmh` (`authority`),
  CONSTRAINT `FKgqebgjja4fdf7rww08icgsqmh` FOREIGN KEY (`authority`) REFERENCES `authorities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `authorities` (
  `id` binary(16) NOT NULL,
  `authority` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq0u5f2cdlshec8tlh6818bhbk` (`authority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `business_accounts` (
  `rating` float DEFAULT NULL,
  `subscription_active` bit(1) DEFAULT NULL,
  `verified` bit(1) DEFAULT NULL,
  `subscription_expires_at` datetime(6) DEFAULT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `verified_by_id` binary(16) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `tax_id` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `request_status` enum('APPROVED','PENDING','REJECTED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKfijinr679cs3fbc0ydblnhxqg` (`tax_id`),
  KEY `FKacswirygdh3ht4xq5yxluns1a` (`verified_by_id`),
  CONSTRAINT `FKacswirygdh3ht4xq5yxluns1a` FOREIGN KEY (`verified_by_id`) REFERENCES `admins` (`id`),
  CONSTRAINT `FKindjikl2j3n6ruoylaw67f15s` FOREIGN KEY (`id`) REFERENCES `appusers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `coin_transactions` (
  `amount` int DEFAULT NULL,
  `balance_after` int DEFAULT NULL,
  `balance_before` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `reference_id` binary(16) DEFAULT NULL,
  `user_id` binary(16) NOT NULL,
  `type` enum('EARN','SPEND') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKselmjllntvrkmp0q8j4j19e0d` (`user_id`),
  CONSTRAINT `FKselmjllntvrkmp0q8j4j19e0d` FOREIGN KEY (`user_id`) REFERENCES `regular_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `event_attendances` (
  `is_attending` bit(1) DEFAULT NULL,
  `confirmed_at` datetime(6) DEFAULT NULL,
  `event_id` binary(16) NOT NULL,
  `id` binary(16) NOT NULL,
  `regular_user_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4bi63m19oyof65xwovacv8lxw` (`regular_user_id`,`event_id`),
  KEY `FKkm1h1i3sngrit7bjmaca44yr9` (`event_id`),
  CONSTRAINT `FKkm1h1i3sngrit7bjmaca44yr9` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `FKniltjh2vtlq7vash4xn3ti6sy` FOREIGN KEY (`regular_user_id`) REFERENCES `regular_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `events` (
  `active` bit(1) DEFAULT NULL,
  `attendee_count` int DEFAULT NULL,
  `category` tinyint DEFAULT NULL,
  `featured` bit(1) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `ends_at` datetime(6) DEFAULT NULL,
  `starts_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `creator_id` binary(16) NOT NULL,
  `id` binary(16) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKp5n6rry8a67hy8owt32pqf0h5` (`creator_id`),
  CONSTRAINT `FKp5n6rry8a67hy8owt32pqf0h5` FOREIGN KEY (`creator_id`) REFERENCES `business_accounts` (`id`),
  CONSTRAINT `events_chk_1` CHECK ((`category` between 0 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `feedback_messages` (
  `created_at` datetime(6) NOT NULL,
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `message` varchar(1000) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `type` enum('BUG','OTHER','SUGGESTION') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8pmfk1m6ret88ddqtas03m60w` (`user_id`),
  CONSTRAINT `FK8pmfk1m6ret88ddqtas03m60w` FOREIGN KEY (`user_id`) REFERENCES `appusers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `notifications` (
  `sent_at` datetime(6) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `reference_id` binary(16) DEFAULT NULL,
  `user_id` binary(16) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `reference_type` varchar(255) DEFAULT NULL,
  `type` enum('ANSWER_TO_QUESTION','NEARBY_EVENT','NEARBY_QUESTION') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKq7q7uwgrv6ba82wt5l36xf1wo` (`user_id`),
  CONSTRAINT `FKq7q7uwgrv6ba82wt5l36xf1wo` FOREIGN KEY (`user_id`) REFERENCES `regular_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `expires_at` datetime(6) NOT NULL,
  `used_at` datetime(6) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `token` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK71lqwbwtklmljk3qlsugr1mig` (`token`),
  KEY `FKcg0dtnyqf9tqp8mg0r5vvsgcf` (`user_id`),
  CONSTRAINT `FKcg0dtnyqf9tqp8mg0r5vvsgcf` FOREIGN KEY (`user_id`) REFERENCES `appusers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `push_devices` (
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `notifications_enabled` bit(1) NOT NULL,
  `last_seen_at` datetime(6) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  `zone_key` varchar(100) DEFAULT NULL,
  `auth` varchar(512) NOT NULL,
  `p256dh` varchar(512) NOT NULL,
  `endpoint` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKl5ke52cbwqujiqx2jxk7brme1` (`user_id`),
  CONSTRAINT `FKl5ke52cbwqujiqx2jxk7brme1` FOREIGN KEY (`user_id`) REFERENCES `regular_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `question_reports` (
  `created_at` datetime(6) NOT NULL,
  `id` binary(16) NOT NULL,
  `question_id` binary(16) NOT NULL,
  `reporter_id` binary(16) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `reason` enum('IRRELEVANT','OFFENSIVE','OTHER','SPAM') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_question_report_reporter_question` (`reporter_id`,`question_id`),
  KEY `FKfgm3si4bm8rcbxro67bp4akse` (`question_id`),
  CONSTRAINT `FK8g61j8gho6igsehyk4ec497yy` FOREIGN KEY (`reporter_id`) REFERENCES `regular_users` (`id`),
  CONSTRAINT `FKfgm3si4bm8rcbxro67bp4akse` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `questions` (
  `active` bit(1) DEFAULT NULL,
  `answer_count` int DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `radius_km` float DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `creator_id` binary(16) NOT NULL,
  `event_id` binary(16) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `content` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa79qkldsqx3sntac53gvte9q5` (`creator_id`),
  KEY `FKdggu9uxwm71ec1gsr8q725w5g` (`event_id`),
  CONSTRAINT `FKa79qkldsqx3sntac53gvte9q5` FOREIGN KEY (`creator_id`) REFERENCES `regular_users` (`id`),
  CONSTRAINT `FKdggu9uxwm71ec1gsr8q725w5g` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `regular_users` (
  `coin_balance` int DEFAULT NULL,
  `premium_active` bit(1) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `verified` bit(1) DEFAULT NULL,
  `visibility_radius_km` float DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FKmvyo59hx96cwqf4l0cplvbsra` FOREIGN KEY (`id`) REFERENCES `appusers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `reports` (
  `reported_at` datetime(6) DEFAULT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  `content_id` binary(16) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `reporter_id` binary(16) NOT NULL,
  `resolved_by_admin_id` binary(16) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('ADMIN','ANSWER_VERIFIED','PENDING','REJECTED','RESOLVED','UNDER_REVIEW') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKau0uo95uwpcg0p7goiesm7yox` (`reporter_id`),
  KEY `FKt1n070uuasqryyu8wpsvs4xel` (`resolved_by_admin_id`),
  CONSTRAINT `FKau0uo95uwpcg0p7goiesm7yox` FOREIGN KEY (`reporter_id`) REFERENCES `regular_users` (`id`),
  CONSTRAINT `FKt1n070uuasqryyu8wpsvs4xel` FOREIGN KEY (`resolved_by_admin_id`) REFERENCES `admins` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `user_locations` (
  `accuracy` float DEFAULT NULL,
  `is_public` bit(1) DEFAULT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `id` binary(16) NOT NULL,
  `user_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfl5rnakkj53oyky6oxsgeskj4` (`user_id`),
  CONSTRAINT `FKfl5rnakkj53oyky6oxsgeskj4` FOREIGN KEY (`user_id`) REFERENCES `appusers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;


