import { Role } from '@prisma/client';
import { ApiError } from './errors';
import { getTeamMember } from 'models/team';

export async function validateMembershipOperation(
  memberId: string,
  teamMember,
  operationMeta?: {
    role?: Role;
  }
) {
  const updatingMember = await getTeamMember(memberId, teamMember.team.slug);
  // Member and Admin can't update the role of Owner
  if (
    (teamMember.role === Role.MEMBRO || teamMember.role === Role.ADMIN) &&
    updatingMember.role === Role.SUPER_ADMIN
  ) {
    throw new ApiError(
      403,
      'You do not have permission to update the role of this member.'
    );
  }
  // Member can't update the role of Admin & Owner
  if (
    teamMember.role === Role.MEMBRO &&
    (updatingMember.role === Role.ADMIN || updatingMember.role === Role.SUPER_ADMIN)
  ) {
    throw new ApiError(
      403,
      'You do not have permission to update the role of this member.'
    );
  }

  // Admin can't make anyone an Owner
  if (teamMember.role === Role.ADMIN && operationMeta?.role === Role.SUPER_ADMIN) {
    throw new ApiError(
      403,
      'You do not have permission to update the role of this member to Owner.'
    );
  }

  // Member can't make anyone an Admin or Owner
  if (
    teamMember.role === Role.MEMBRO &&
    (operationMeta?.role === Role.ADMIN || operationMeta?.role === Role.SUPER_ADMIN)
  ) {
    throw new ApiError(
      403,
      'You do not have permission to update the role of this member to Admin.'
    );
  }
}
