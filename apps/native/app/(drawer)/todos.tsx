import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	ScrollView,
	ActivityIndicator,
	Alert,
	Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";
import { Card, Checkbox, useThemeColor, Chip } from "heroui-native";

export default function TodosScreen() {
	const [newTodoText, setNewTodoText] = useState("");
	const todos = useQuery(trpc.todo.getAll.queryOptions());
	const createMutation = useMutation(
		trpc.todo.create.mutationOptions({
			onSuccess: () => {
				todos.refetch();
				setNewTodoText("");
			},
		}),
	);
	const toggleMutation = useMutation(
		trpc.todo.toggle.mutationOptions({
			onSuccess: () => {
				todos.refetch();
			},
		}),
	);
	const deleteMutation = useMutation(
		trpc.todo.delete.mutationOptions({
			onSuccess: () => {
				todos.refetch();
			},
		}),
	);

	const mutedColor = useThemeColor("muted");
	const accentColor = useThemeColor("accent");
	const dangerColor = useThemeColor("danger");
	const foregroundColor = useThemeColor("foreground");

	const handleAddTodo = () => {
		if (newTodoText.trim()) {
			createMutation.mutate({ text: newTodoText });
		}
	};

	const handleToggleTodo = (id: number, completed: boolean) => {
		toggleMutation.mutate({ id, completed: !completed });
	};

	const handleDeleteTodo = (id: number) => {
		Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => deleteMutation.mutate({ id }),
			},
		]);
	};

	const isLoading = todos?.isLoading;
	const completedCount = todos?.data?.filter((t) => t.completed).length || 0;
	const totalCount = todos?.data?.length || 0;

	return (
		<Container>
			<ScrollView className="flex-1" contentContainerClassName="p-6">
				<View className="mb-6">
					<View className="flex-row items-center justify-between mb-2">
						<Text className="text-3xl font-bold text-foreground">
							Todo List
						</Text>
						{totalCount > 0 && (
							<Chip variant="secondary" color="accent" size="sm">
								<Chip.Label>
									{completedCount}/{totalCount}
								</Chip.Label>
							</Chip>
						)}
					</View>
				</View>

				<Card variant="secondary" className="mb-6 p-4">
					<View className="flex-row items-center gap-3">
						<View className="flex-1">
							<TextInput
								value={newTodoText}
								onChangeText={setNewTodoText}
								placeholder="Add a new task..."
								placeholderTextColor={mutedColor}
								editable={!createMutation.isPending}
								onSubmitEditing={handleAddTodo}
								returnKeyType="done"
								className="text-foreground text-base py-3 px-4 border border-divider rounded-lg bg-surface"
							/>
						</View>
						<Pressable
							onPress={handleAddTodo}
							disabled={createMutation.isPending || !newTodoText.trim()}
							className={`p-3 rounded-lg active:opacity-70 ${createMutation.isPending || !newTodoText.trim() ? "bg-surface" : "bg-accent"}`}
						>
							{createMutation.isPending ? (
								<ActivityIndicator size="small" color={foregroundColor} />
							) : (
								<Ionicons
									name="add"
									size={24}
									color={
										createMutation.isPending || !newTodoText.trim()
											? mutedColor
											: foregroundColor
									}
								/>
							)}
						</Pressable>
					</View>
				</Card>

				{isLoading && (
					<View className="items-center justify-center py-12">
						<ActivityIndicator size="large" color={accentColor} />
						<Text className="text-muted mt-4">Loading todos...</Text>
					</View>
				)}

				{todos?.data && todos.data.length === 0 && !isLoading && (
					<Card className="items-center justify-center py-12">
						<Ionicons
							name="checkbox-outline"
							size={64}
							color={mutedColor}
							style={{ marginBottom: 16 }}
						/>
						<Text className="text-foreground text-lg font-semibold mb-2">
							No todos yet
						</Text>
						<Text className="text-muted text-center">
							Add your first task to get started!
						</Text>
					</Card>
				)}

				{todos?.data && todos.data.length > 0 && (
					<View className="gap-3">
						{todos.data.map((todo) => (
							<Card key={todo.id} variant="secondary" className="p-4">
								<View className="flex-row items-center gap-3">
									<Checkbox
										isSelected={todo.completed}
										onSelectedChange={() =>
											handleToggleTodo(todo.id, todo.completed)
										}
									/>
									<View className="flex-1">
										<Text
											className={`text-base ${todo.completed ? "text-muted line-through" : "text-foreground"}`}
										>
											{todo.text}
										</Text>
									</View>
									<Pressable
										onPress={() => handleDeleteTodo(todo.id)}
										className="p-2 rounded-lg active:opacity-70"
									>
										<Ionicons
											name="trash-outline"
											size={24}
											color={dangerColor}
										/>
									</Pressable>
								</View>
							</Card>
						))}
					</View>
				)}
			</ScrollView>
		</Container>
	);
}
