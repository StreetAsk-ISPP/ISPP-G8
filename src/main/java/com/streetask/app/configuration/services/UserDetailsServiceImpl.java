package com.streetask.app.configuration.services;

import org.springframework.beans.factory.annotation.Autowired;
import com.streetask.app.user.User;
import com.streetask.app.user.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	UserRepository userRepository;

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
		String normalizedIdentifier = identifier == null ? "" : identifier.trim();

		User user = userRepository.findByEmailIgnoreCase(normalizedIdentifier)
				.or(() -> userRepository.findByUserNameIgnoreCase(normalizedIdentifier))
				.orElseThrow(() -> new UsernameNotFoundException(
						"User Not Found with email or username: " + normalizedIdentifier));

		return UserDetailsImpl.build(user);
	}

}
