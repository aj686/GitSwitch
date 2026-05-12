export type GitProvider = 'GitHub' | 'GitLab' | 'Bitbucket' | 'Kubernetes' | 'Custom';

export interface GitAccount {
  id: string;
  name: string;
  email: string;
  provider: GitProvider;
  avatarUrl?: string;
  isDefault: boolean;
  username: string;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  status: 'success' | 'error' | 'info';
}
